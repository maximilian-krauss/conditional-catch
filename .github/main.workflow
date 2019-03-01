workflow "Trigger" {
  on = "push"
  resolves = ["test"]
}

action "install" {
  uses = "actions/npm@master"
  runs = "npm"
  args = "install"
}

action "test" {
  uses = "actions/npm@master"
  needs = ["install"]
  runs = "npm"
  args = "test"
}
