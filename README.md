# zip-builder

A simple tool to build ZIP archives from GIT repositories, built with Angular.

The API executes git shell commands to gather information about the repository.

### Prerequisites

[GIT](https://git-scm.com)

A web server to serve the app and the PHP backend.

### Installing

1. Download the latest release and clone the API to your local machine:

    ```https://github.com/timo-cingoez/zip-builder/releases/tag/v1.1```
    ```bash
    git clone https://github.com/timo-cingoez/zip-builder-api.git
    ```

2. Unzip the release and copy both folders to your web server's document root. The document root is the directory from which your web server serves files. This directory is often named `public_html`, `htdocs`, or `www`. If you're unsure about the document root location, refer to your web server's configuration.

3. Navigate to zip-builder/assets and rename the config.json.example to config.json.

4. Edit config.json and replace the defaults with appropriate values to match your configuration.

4. Access the project in your web browser by navigating to `http://{your-host}/zip-builder`.

# TODO
* prevent initialization requests if no config is present
* add async toast messages for actions (initialization, fetching commits, creating ZIP, ..)
* refactor API to proper endpoints

# FUTURE
* port to electron
