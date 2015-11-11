# Ionic Side Menu Component

## Side Menu 2
![ionSideMenu-2.png](https://dl.dropboxusercontent.com/u/30873364/all_final%202.png)


### To change the styles
`ionic.app.scss` is the root file. It contains all the includes needed for the project:

- `@import "scss/utils/mixins";`
Sass mixins that ease the job in our project

- `@import "scss/variables";`
Here are all the variables you can play with. They provide an easy way to customize the styles. Sass variables are an easy way to maintain your css, you just need to change one variable in your scss file instead of changing one value in several places within your css files

- `@import "scss/utils/override_variables";`
Just in case you want to override some Ionic variables

- `@import "www/lib/bourbon/app/assets/stylesheets/_bourbon";`
Bourbon provides mixins and other stuff to ease even more when using Sass

- `@import "www/lib/ionic/scss/ionic";`
Include ionic stuff

- `@import "scss/side-menu";`
Include all the styles for the side menu component
