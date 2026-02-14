#!/usr/bin/env bash
set -euo pipefail

npx vitest run --coverage --coverage.provider=v8 --coverage.reporter=lcov --coverage.reportsDirectory=coverage
