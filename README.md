# 110_Project

Standup Meeting Recording:
https://drive.google.com/file/d/1oFhjV9ceQuPqMAko7btNt3rOcjJBlv7z/view?usp=sharing


## Automated checks (CI)

GitHub Actions runs `npm ci`, `npm test`, and `npx --no-install tsc --noEmit`
on pushes and pull requests. The workflow uses Node.js 26, matching the current
development environment. A failed command makes the CI job fail.

View runs: https://github.com/vivanhegde/110_Project/actions

After pushing a branch, open the Actions tab and select **CI** to inspect its
results. Pull requests also show the **Tests and TypeScript** check. The workflow
must be on GitHub before it can run; local commits alone do not trigger it.
