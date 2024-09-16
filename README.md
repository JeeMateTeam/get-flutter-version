# Get flutter version

Get flutter verion number and build number from pubspec.yaml


### Outputs

- `version_number`: The flutter version number in pubspect.yaml
- `builder_number`: The flutter build number in pubspect.yaml

### Example workflow - get flutter version number and build number
On every `push` to `master` branch

```yaml
name: "build"
on: # rebuild on master branch changes
  push:
    branches:
      - master

jobs:
  build: # make sure build/ci work properly
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Get flutter version
        id: get_flutter_version
        uses: its404/get-flutter-version@v1.0.0
      - name: Output flutter version
        run: echo 'version_number:' ${{ steps.get_flutter_version.outputs.version_number }} ' build_number:' ${{ steps.get_flutter_version.outputs.build_number }}
```
