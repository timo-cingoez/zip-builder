# zip-builder

A simple tool to build ZIP archives from GIT repositories, built with Angular.

The API executes git shell commands to gather information about the repository.

### Prerequisites

GIT.

A web server to serve the app and the PHP backend.

### Installing

1. Clone the latest release of the project and the API to your local machine:

    ```bash
    git clone https://github.com/timo-cingoez/zip-builder.git
    git clone https://github.com/timo-cingoez/zip-builder-api.git
    ```

2. Copy the cloned repositories to your web server's document root. The document root is the directory from which your web server serves files. This directory is often named `public_html`, `htdocs`, or `www`. If you're unsure about the document root location, refer to your web server's configuration.

3. Navigate to zip-builder/assets and rename the config.json.example to config.json.

4. Edit config.json and replace the defaults with appropriate values to match your configuration.

4. Access the project in your web browser by navigating to `http://{your-host}/zip-builder`.

# TODO
* prevent initialization requests if no config is present
* fetch excluded dirs from API (should be configurable in config)
* add async toast messages for actions (initialization, fetching commits, creating ZIP, ..)
* refactor API to proper endpoints
* add a global debug var to bind logs, especially for requests with big responses

# FUTURE
* port to electron
