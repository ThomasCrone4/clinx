#!/bin/bash
# Bulk rename all .jsx to .tsx
find src -name "*.jsx" -type f | while read file; do
  mv "$file" "${file%.jsx}.tsx"
done
echo "Renamed all .jsx files to .tsx"
find src -name "*.tsx" -o -name "*.ts" | grep -v node_modules | wc -l
