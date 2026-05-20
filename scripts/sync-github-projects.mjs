import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const rootDir = join(__dirname, '..')
const configPath = join(rootDir, 'src', 'config', 'projects-config.json')
const outputPath = join(rootDir, 'src', 'data', 'personal-projects.json')

let config
try {
  config = JSON.parse(readFileSync(configPath, 'utf-8'))
} catch (err) {
  console.error('Failed to read config:', err.message)
  process.exit(1)
}

const { githubUsername, excludeRepos, groups, overrides, contributionsOverrides, externalProjects } = config

function repoToTitle(name) {
  return name
    .replace(/-/g, ' ')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase())
}

async function fetchAllRepos(username) {
  const repos = []
  let page = 1
  while (true) {
    const url = `https://api.github.com/users/${username}/repos?per_page=100&page=${page}&sort=updated`
    const res = await fetch(url, {
      headers: { 'User-Agent': 'portfolio-sync/1.0' }
    })
    if (!res.ok) {
      throw new Error(`GitHub API error (${res.status}): ${res.statusText}`)
    }
    const data = await res.json()
    if (!data.length) break
    repos.push(...data)
    page++
  }
  return repos
}

function matchGlob(name, pattern) {
  if (pattern.endsWith('*')) {
    return name.startsWith(pattern.slice(0, -1))
  }
  return name === pattern
}

async function main() {
  console.log(`Fetching repos for ${githubUsername}...`)

  let repos
  try {
    repos = await fetchAllRepos(githubUsername)
  } catch (err) {
    console.error('GitHub API error:', err.message)
    if (existsSync(outputPath)) {
      console.log('Using cached data from', outputPath)
      return
    }
    console.log('No cached data available. Generating empty output.')
    repos = []
  }

  const excludedSet = new Set(excludeRepos || [])

  const filtered = repos.filter(r => !excludedSet.has(r.name))

  const groupedRepoNames = new Set()
  for (const group of (groups || [])) {
    for (const repoName of group.repos) {
      groupedRepoNames.add(repoName)
    }
  }

  const forks = filtered.filter(r => r.fork)
  const ownRepos = filtered.filter(r => !r.fork)

  const ownProjects = []

  for (const group of (groups || [])) {
    const matchedRepos = group.repos
      .map(name => repos.find(r => r.name === name))
      .filter(Boolean)

    if (!matchedRepos.length) continue

    const links = matchedRepos.map(r => ({
      text: r.name,
      url: r.html_url
    }))

    const totalStars = matchedRepos.reduce((sum, r) => sum + r.stargazers_count, 0)
    const latestUpdate = matchedRepos.reduce((latest, r) => r.pushed_at > latest ? r.pushed_at : latest, '')

    ownProjects.push({
      id: group.id,
      title: group.title,
      description: group.description || '',
      tags: group.tags || [],
      links,
      stars: totalStars,
      updatedAt: latestUpdate
    })
  }

  for (const repo of ownRepos) {
    if (groupedRepoNames.has(repo.name)) continue
    if (repo.name === 'BCC' || repo.name === 'bpmn2') continue

    const override = (overrides || {})[repo.name]
    const title = override?.title || repoToTitle(repo.name)
    const desc = override?.description || repo.description || ''
    const tags = override?.tags || (repo.language ? [repo.language] : [])

    const entry = {
      id: repo.name,
      title,
      description: desc,
      tags,
      stars: repo.stargazers_count,
      updatedAt: repo.pushed_at
    }

    if (override?.links) {
      entry.links = override.links
    } else {
      entry.link = repo.html_url
    }

    ownProjects.push(entry)
  }

  const contributionsProjects = []

  for (const repo of forks) {
    const override = (contributionsOverrides || {})[repo.name]
    const title = override?.title || repoToTitle(repo.name)
    const tags = override?.tags || (repo.language ? [repo.language] : [])
    const desc = override?.description || repo.description || ''

    const entry = {
      id: repo.name,
      title,
      description: desc,
      tags,
      fork: true,
      link: repo.html_url,
      updatedAt: repo.pushed_at
    }

    if (override?.links) {
      entry.links = override.links
    }

    if (repo.fork && repo.source?.html_url) {
      entry.originalRepo = repo.source.html_url
    }

    contributionsProjects.push(entry)
  }

  const conceptsProjects = (externalProjects || []).map(ext => ({
    id: ext.id,
    title: ext.title,
    description: ext.description || '',
    tags: ext.tags || [],
    links: ext.links || [],
    external: true
  }))

  const output = {
    updatedAt: new Date().toISOString(),
    own: ownProjects,
    concepts: conceptsProjects,
    contributions: contributionsProjects
  }

  const outputDir = dirname(outputPath)
  if (!existsSync(outputDir)) {
    mkdirSync(outputDir, { recursive: true })
  }

  writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf-8')
  console.log(`Generated ${outputPath}`)
  console.log(`  ${ownProjects.length} personal projects`)
  console.log(`  ${conceptsProjects.length} concepts`)
  console.log(`  ${contributionsProjects.length} contributions`)
}

main().catch(err => {
  console.error('Sync failed:', err)
  process.exit(1)
})
