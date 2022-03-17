# A simple template that already setup Webpack and some useful modules to save time

This template can help you build a website easily. By using this template, we will have:

- Hot reloading
- Automatically compile SCSS
- Minimize CSS
- Clean SCSS architecture

## Some modules are already setup:

- webpack-cli: for recognizing command from your terminal
- webpack-dev-server: to run your website locally on your machine
- html-webpack-plugin: you will need it to configure you webpack.config.js
- css-loader: analyze syntax into Javascript
- sass-loader: convert sass to css
- style-loader: include CSS into \<style\>
- mini-css-extract-plugin: minimize file css for production.

## Get stated

After clone this repository, we run the below commands:

```cmd
    npm install
    npm run start
```

### The structure of this project:

- font: where we put necessary fonts for our website
- img: where we put necessary images for our website
- js: where we put our .js file to handle the logic of our website
  - libs: where .js files of which libraries we use
  - index.js: the main js file that includes necessary modules
- scss:
  - style.scss: includes all .scss files we have
  - import/
    - core/\*.scss: those files like Bootrap
    - pages/\*.scss: Each file contains style sheet of each page of our website

### Create new html file

When creating a new html file, we define it in webpack.config.js:

```js
...
    plugins: [
        ...,
        new HtmlWebpackPlugin({
            template: 'new_file.html',
            inject: true,
            chunks: [], // ref to javascript files
            filename: 'new_file.html'
        }),
        ...
    ]
```
