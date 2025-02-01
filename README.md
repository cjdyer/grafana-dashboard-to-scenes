# Dashboard to Grafana Scene Converter

This repository provides a utility to convert a Grafana dashboard JSON file into a React component
that renders an EmbeddedScene using @grafana/scenes. The script parses panel configurations from the
dashboard JSON and maps them to corresponding React components.

## How It Works

1. **Read Dashboard JSON**: The script reads a Grafana dashboard JSON file.
2. **Parse Panels**: It identifies supported panel types (`gauge`, `stat`, `table`) and generates corresponding React components.
3. **Generate Scene Component**: It uses a template (`sceneTemplate.ts`) to structure the Scene.
4. **Write Output**: The generated component is saved as `GeneratedScene.tsx` which can then be used
   in a Grafana Scenes app.

## Installation

1. Clone the repository:
    ```sh
    git clone git@github.com:cjdyer/grafana-dashboard-to-scenes.git
    cd grafana-dashboard-to-scenes
    ```
3. Use correct node version:
    ```sh
    nvm use
    OR
    nvm install
    ```
5. Install dependencies:
    ```sh
    npm install
    ```

## Usage

Run the script with the example dashboard JSON file:

```sh
npm run generate:example
```

Run the script with a provided dashboard JSON file:

```sh
npx ts-node src/index.ts <JSON file path>
```

This will generate the `GeneratedScene.tsx` file, which can be used in a Grafana plugin or project.

## Example Input & Output

### Input: Example Dashboard JSON

```json
{
    "panels": [
        {
            "type": "gauge",
            "title": "CPU Usage",
            "options": {"min": 0, "max": 100}
        },
        {
            "type": "stat",
            "title": "Memory Usage",
            "options": {}
        }
    ]
}
```

### Output: GeneratedScene.tsx

```tsx
import React from 'react';
import { EmbeddedScene, SceneGridLayout } from '@grafana/scenes';

const CPUUsage = /* Generated gauge component */;
const MemoryUsage = /* Generated stat component */;

export default function GeneratedDashboard() {
  const scene = new EmbeddedScene({
    body: new SceneGridLayout({
      children: [CPUUsage, MemoryUsage],
    }),
  });

  return <scene.Component model={scene} />;
}
```

## Supported Panels

-   **Gauge Panel**
-   **Stat Panel**
-   **Table Panel**
