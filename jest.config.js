const fs = require('fs')

const packages = fs.readdirSync('./packages')

module.exports = {
    projects: [
        packages.map(name => {
            return {
                name,
                displayName: name,
                preset: 'ts-jest',
                setupFiles: ['<rootDir>/scripts/jestSetUp'],
                setupFilesAfterEnv: ['jest-extended'],
                moduleNameMapper: {
                    [`^@teamwork/(${packages.join(
                        '|',
                    )})$`]: '<rootDir>/packages/$1/src',
                },
                globals: {
                    'ts-jest': {
                        tsConfig: require(`./packages/${name}/tsconfig.json`)
                            .compilerOptions,
                    },
                },
                testEnvironment: 'node',
                testMatch: [`<rootDir>/packages/${name}/src/**/*.test.ts`],
            }
        }),
    ],
    collectCoverage: true,
    collectCoverageFrom: [
        '<rootDir>/packages/*/src/**/*.{ts,tsx,js,jsx}',
        '!<rootDir>/packages/*/src/**/*.test.{ts,tsx,js,jsx}',
        '!<rootDir>/**/*.d.{ts,tsx,js,jsx}',
        '!<rootDir>/node_modules/',
    ],
}
