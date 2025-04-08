export const prepareProjectChartData = (projectData) => {
  if (
    !projectData?.projectCompensators ||
    projectData.projectCompensators.length === 0
  ) {
    return [];
  }

  const actualFunding = parseFloat(projectData.amountFunded) || 0;
  const targetFunding = parseFloat(projectData.budget) || 0;
  const capsFunded = parseFloat(projectData.actualCompensation) || 0;
  const targetCaps = parseFloat(projectData.targetCompensation) || 0;

  const { compensatorsTotalFunded, compensatorsTotalCaps } =
    projectData.projectCompensators.reduce(
      (memo, comp) => ({
        compensatorsTotalFunded:
          memo.compensatorsTotalFunded + (parseFloat(comp?.amountFunded) || 0),
        compensatorsTotalCaps:
          memo.compensatorsTotalCaps + (parseFloat(comp?.capsFunded) || 0),
      }),
      { compensatorsTotalFunded: 0, compensatorsTotalCaps: 0 }
    );

  const projectRemainingCaps = Math.max(0, targetCaps - capsFunded);
  const projectRemainingFunding = Math.max(0, targetFunding - actualFunding);

  const chartData = projectData.projectCompensators.map((comp) => ({
    name: comp?.compensator?.name || 'Unknown',
    amount: parseFloat(comp?.amountFunded) || 0,
    caps: parseFloat(comp?.capsFunded) || 0,
    documentId: comp?.compensator?.documentId,
    id: comp?.id,
    value: parseFloat(comp?.amountFunded) || 0,
    compensator: comp.compensator,
    contributionId: comp.documentId,
  }));

  if (compensatorsTotalFunded < actualFunding) {
    const unknownSourceFunding = actualFunding - compensatorsTotalFunded;
    const unknownSourceCaps = capsFunded - compensatorsTotalCaps;
    chartData.push({
      name: 'Other Sources',
      amount: unknownSourceFunding,
      caps: unknownSourceCaps,
      documentId: null,
      id: 'unfunded',
      value: unknownSourceFunding,
    });
  }

  if (
    compensatorsTotalFunded < targetFunding &&
    projectRemainingCaps > 0 &&
    projectRemainingFunding > 0
  ) {
    chartData.push({
      name: 'Caps Available',
      amount: projectRemainingFunding,
      caps: projectRemainingCaps,
      documentId: null,
      id: 'unfunded',
      value: projectRemainingFunding,
      isUnfunded: true,
    });
  }

  return chartData;
};
