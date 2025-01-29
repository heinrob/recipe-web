# RecipeMD Web

*wip*

Displaying recipes in [RecipeMD format](https://github.com/RecipeMD/RecipeMD) through the magic of a Create-React-App.

## Running your own instance

You can set up your own instance on [GitHub Pages](https://pages.github.com). Just follow these steps:

1. Fork this repository

2. Set up a domain or subdomain for your recipes, and configure the DNS according to [GitHub's instructions](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site)

3. Set up the configuration for your instance, by [setting action variables for the repository](https://docs.github.com/en/actions/writing-workflows/choosing-what-your-workflow-does/store-information-in-variables#creating-configuration-variables-for-a-repository).

    - `CNAME`: The domain/subdomain you configured in step to, e.g. `recipes.example.com`

    - `REPOSITORIES`: The repository containing your recipes. This is a JSON array in the following format:
        ```
        [{"username":"<GitHub username>","repository":"<repository name>","branch":"<branch>"}]
        ```
        You an also add additional objects to the array to show recipes from multiple REPOSITORIES

4. Enable GitHub Pages in your repository's settings, and run the deploy workflow in the repositories actions.