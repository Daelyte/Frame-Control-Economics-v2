# Data Directory

This directory is used by the `netlify-plugin-fetch-feeds` plugin.

## Current Status
The plugin is configured with placeholder values to prevent build failures.

## To Disable
Remove the `netlify-plugin-fetch-feeds` plugin from your Netlify site settings:
1. Go to Netlify Dashboard → Site Settings → Plugins
2. Find "Fetch Feeds" plugin
3. Click Uninstall/Remove

## To Use Properly
Configure real RSS/Atom feeds in `netlify.toml`:

```toml
[[plugins]]
  package = "netlify-plugin-fetch-feeds"
  [plugins.inputs]
    dataDir = "./src/data"
    feeds = [
      {
        name = "blog-feed",
        url = "https://yourblog.com/feed.xml",
        output = "blog-posts.json"
      }
    ]
```