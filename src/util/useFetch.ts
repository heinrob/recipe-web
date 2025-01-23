import { useEffect } from "react";
import useLocalstorage from "./useLocalstorage";
import { parseRecipe, RecipeList } from "./Recipedata";

type RecipeFileList = {
  sha: string;
  url: string;
  tree: {
    path: string;
    mode: string;
    type: string;
    sha: string;
    size: number;
    url: string;
  }[];
}

type Repository = {
  username: string;
  repository: string;
  branch: string;
};

export function useFetch(repositories: Repository[]): [RecipeList] {
  const [list, setList] = useLocalstorage<RecipeFileList | undefined>("fileList", undefined);
  const [recipes, setRecipes] = useLocalstorage<RecipeList>("recipes", {});
  const [updated, setUpdated] = useLocalstorage<number>("updated", 0);


  useEffect(() => {
    // Only update once per hour
    if(updated + 1000 * 60 * 60 > Date.now()) {
      return;
    }
    repositories.forEach((repo) => {
      const listURL = `https://api.github.com/repos/${repo.username}/${repo.repository}/git/trees/${repo.branch}?recursive=1`;
      fetch(listURL)
      .then((raw) => raw.json())
      .then((result) => {
        // update recipes
        (result as RecipeFileList).tree.forEach(element => {
          const updateRecipe = (list?.tree.findIndex((value) => value.path === element.path && value.sha === element.sha) ?? -1) < 0;
          if(element.path.endsWith(".md") && element.path !== "README.md" && updateRecipe) {
            const root = `https://raw.githubusercontent.com/${repo.username}/${repo.repository}/${repo.branch}/`;
            const recipeURL = new URL(element.path, root).href;
            fetch(recipeURL)
            .then((raw) => raw.text())
            .then((recipe) => {
              const parsed = parseRecipe(element.path, recipe, repo.username, root);
              setRecipes(prev => ({...prev, [parsed.slug]: parsed}));
            });
          }
        });
        if(!list || list.sha !== (result as RecipeFileList).sha) {
          setList(result);
        }
        setUpdated(Date.now());
      });
    });
  }, [list, repositories, setList, setRecipes, setUpdated, updated]);
  return [recipes];
};