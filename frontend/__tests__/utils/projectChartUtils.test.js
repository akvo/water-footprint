import { prepareProjectChartData } from '../../utils/projectChartUtils';

describe('prepareProjectChartData', () => {
  it('returns empty array for null/undefined input', () => {
    expect(prepareProjectChartData(null)).toEqual([]);
    expect(prepareProjectChartData(undefined)).toEqual([]);
  });

  it('returns empty array when no project compensators', () => {
    expect(prepareProjectChartData({})).toEqual([]);
    expect(prepareProjectChartData({ projectCompensators: [] })).toEqual([]);
  });

  it('correctly processes project compensator data', () => {
    const mockProject = {
      amountFunded: '1000',
      budget: '2000',
      actualCompensation: '500',
      targetCompensation: '1000',
      projectCompensators: [
        {
          capsFunded: '300',
          amountFunded: '600',
          id: '1',
          documentId: 'doc1',
          compensator: {
            name: 'Compensator 1',
            documentId: 'comp1',
          },
        },
      ],
    };

    const result = prepareProjectChartData(mockProject);

    expect(result).toHaveLength(3); // One compensator + available caps
    expect(result[0]).toMatchObject({
      name: 'Compensator 1',
      amount: 600,
      caps: 300,
      documentId: 'comp1',
    });
    expect(result[1]).toMatchObject({
      name: 'Other Sources',
      amount: 400,
      caps: 200,
    });
    expect(result[2]).toMatchObject({
      name: 'Caps Available',
      amount: 1000,
      caps: 500,
      isUnfunded: true,
    });
  });

  it('adds Other Sources when there is unattributed funding', () => {
    const mockProject = {
      amountFunded: '1000',
      budget: '1000',
      actualCompensation: '500',
      targetCompensation: '500',
      projectCompensators: [
        {
          capsFunded: '200',
          amountFunded: '400',
          compensator: {
            name: 'Compensator 1',
            documentId: 'comp1',
          },
        },
      ],
    };

    const result = prepareProjectChartData(mockProject);

    expect(result).toHaveLength(2);
    expect(result[1]).toMatchObject({
      name: 'Other Sources',
      amount: 600,
      caps: 300,
    });
  });
});
