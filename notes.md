1.

```yml
name: Node.js CI

# CI should be runned on master branch and on PR targeting master
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs: # Jobs are a group of steps
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2 # Actions are "packages" for GHA
      - uses: actions/setup-node@v2
        with: # Actions can have parameters
          node-version: 14.x
      - run: yarn install
      - run: yarn lint # Use the "run:" to execute some bash command
      - run: yarn test
      - run: yarn build
```

2.

```yml
name: Node.js CI

# CI should be runned on master branch and on PR targeting master
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs: # Jobs are a group of steps
  install:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2 # Actions are "packages" for GHA
      - uses: actions/setup-node@v2
        with: # Actions can have parameters
          node-version: 14.x
      - run: yarn install # Use the "run:" to execute some bash command

  test:
    runs-on: ubuntu-latest

    needs: install

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 14.x
      - run: TEST=salut yarn test

  build:
    runs-on: ubuntu-latest

    needs: install

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 14.x
      - run: yarn build

  e2e:
    runs-on: ubuntu-latest

    needs: build

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 14.x
      - run: yarn e2e
```

```yml
name: Node.js CI

# CI should be runned on master branch and on PR targeting master
on:
  push:
    branches: [master]
  pull_request:
    branches: [master]

jobs: # Jobs are a group of steps
  install:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2 # Actions are "packages" for GHA
      - uses: actions/setup-node@v2
        with: # Actions can have parameters
          node-version: 14.x
      - run: yarn install # Use the "run:" to execute some bash command
      - run: tar -zcf node_modules.tar.gz ./node_modules
      - uses: actions/upload-artifact@v2
        with:
          name: project-dependencies
          path: node_modules.tar.gz
          retention-days: 1

  test:
    runs-on: ubuntu-latest

    needs: install

    strategy:
      matrix:
        include:
          - variable: wesh
          - variable: bonjour
          - variable: smaug

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 14.x
      - run: TEST=${{matrix.variable}} yarn test

  build:
    runs-on: ubuntu-latest

    needs: install

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 14.x
      - uses: actions/download-artifact@v2
        with:
          name: project-dependencies
      - run: tar -zxf node_modules.tar.gz
      - run: yarn build
      - run: tar -zcf dist.tar.gz ./dist
      - uses: actions/upload-artifact@v2
        with:
          name: app-build
          path: dist.tar.gz
          retention-days: 1

  e2e:
    runs-on: ubuntu-latest

    needs: build

    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: 14.x
      - uses: actions/download-artifact@v2
        with:
          name: app-build
      - run: tar -zxf dist.tar.gz
      - run: yarn e2e
```
