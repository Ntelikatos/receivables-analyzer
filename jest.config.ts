import nextJest from 'next/jest'
import {pathsToModuleNameMapper} from 'ts-jest'

import {compilerOptions} from './tsconfig.json';

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
    dir: './',
})

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {prefix: '<rootDir>/'} /*, { prefix: '<rootDir>/' } */)
};