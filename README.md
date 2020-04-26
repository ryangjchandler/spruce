<p align="center">
    <img src="./docs/example.png" width="50%" />
</p>

# 🌲 Spruce

A lightweight state management layer for Alpine.js

## Installation

Include the following `<script>` tag in the `<head>` of your document:

```html
<script src="/path/to/spruce.js">
```

> **Important**: This must be added **before** loading Alpine.js when using CDN links.

### Manual

If you wish to include Spruce with your own bundle:

```bash
yarn add @ryangjchandler/spruce
```

Then add the following to your script:

```javascript
import Spruce from '@ryangjchandler/spruce'
```