import * as core from '@actions/core'
import {join} from 'path'
import {readFile} from 'fs'
import {load as loadYaml} from 'js-yaml'

type safeLoadType = string | object | undefined | unknown

interface Pubspec {
  version?: string
}

async function run(): Promise<void> {
  try {
    await getFlutterVersion()
  } catch (error) {
    const err = error as Error
    core.setFailed(err.message)
  }
}

run()

async function getFlutterVersion(): Promise<void> {
  const dir = process.env.GITHUB_WORKSPACE || './'
  const pubspecYaml = join(dir, 'pubspec.yaml')
  const pubspecObj = await readYamlFile(pubspecYaml)

  if (!pubspecObj) {
    throw new Error(`pubspec.yaml not found ${pubspecYaml}`)
  }
  if (typeof pubspecObj !== 'object') {
    throw new Error(`${pubspecObj} is not an object`)
  }

  const pubspecData = pubspecObj as Pubspec
  if (!pubspecData.version) {
    throw new Error('version not found in pubspec.yaml')
  }
  const versionList = pubspecData.version.split('+')

  if (versionList.length !== 2) {
    throw new Error('invalid version format in pubspec.yaml')
  }

  core.info(`version_number: ${versionList[0]}`)
  core.info(`build_number: ${versionList[1]}`)
  core.setOutput('version_number', versionList[0])
  core.setOutput('build_number', versionList[1])
}

async function readYamlFile(file: string): Promise<safeLoadType> {
  const fileData: string = await new Promise((resolve, reject) =>
    readFile(file, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  )
  return loadYaml(fileData)
}
