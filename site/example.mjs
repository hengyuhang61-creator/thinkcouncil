export const example = {
  question: "Should we publish MachAtlas now as a reproducible post-processing atlas, or wait until we can claim new solver validation?",
  a: "Publish the post-processing atlas with explicit scope",
  b: "Hold publication until a new solver study is validated",
  evidence: [
    {
      claim: "CI re-fetched pinned inputs, replayed all three cases, rebuilt the plots and verified the release table.",
      source: "https://github.com/hengyuhang61-creator/machatlas/actions/runs/45278190764",
      type: "record", role: "a",
    },
    {
      claim: "At one FUN3D station, moving a fixed 3 mm radial band reverses the nominal SA versus SST-Vm ranking.",
      source: "https://hengyuhang61-creator.github.io/machatlas/cone.html",
      type: "derived", role: "limit",
    },
    {
      claim: "The project has no native solver execution or grid-convergence evidence for the atlas.",
      source: "https://github.com/hengyuhang61-creator/machatlas/blob/v0.1.0/README.md",
      type: "record", role: "limit",
    },
    {
      claim: "Waiting for a stronger validation package might attract more readers.",
      source: "Unmeasured audience hypothesis for this decision",
      type: "hypothesis", role: "b",
    },
  ],
};
