import React from 'react';

const ComparisonTable = () =>
{
  // Data structure to hold product names and their corresponding logo URLs
  const products = [
    {
      name: 'EventJacket',
      logo: 'https://www.eventjacket.com/images/logo.svg',
    },
    {
      name: 'EventBrite',
      logo: '/images/eventbrite.png',
    },
    {
      name: 'TicketLeap',
      logo: '/images/tl.jpg',
    },
  ];

  return (
    <div>
      {/* Comparison Table */ }
      <section className="bg-gray-50 dark:bg-gray-900 py-10 sm:py-10">
        <div className="max-w-screen-xl px-2 mx-auto lg:px-12">
          <div className="relative overflow-hidden bg-white shadow-2xl dark:bg-gray-900 sm:rounded-lg">
            <div className="flex flex-col items-start justify-between p-4 space-y-3 dark:bg-gray-800 md:flex-row md:items-center md:space-y-0 md:space-x-4">
              <div className="flex items-center">
                <h5 className="mr-3 font-semibold dark:text-white">Compare Products</h5>
              </div>
            </div>
            <div className="mx-4 dark:mx-0 border-t dark:border-gray-700 dark:bg-gray-800"></div>
            <div className="flex flex-col items-center justify-left p-4 space-y-3 dark:bg-gray-800 md:flex-row md:space-y-0 md:space-x-4"></div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-900 dark:text-white">
                  <tr>
                    <th scope="col" className="px-4 py-3"></th>
                    {/* Add column headers dynamically */ }
                    { products.map( ( product ) => (
                      <th key={ product.name } scope="col" className="px-4 py-3">
                        <div className="text-lg flex flex-col items-center lg:items-start">
                          <div className="flex flex-col items-center">
                            <img
                              src={ product.logo }
                              alt={ product.name }
                              className="max-h-32 w-auto object-contain"
                            />
                           
                          </div>
                        </div>
                      </th>
                    ) ) }
                  </tr>
                </thead>
                <tbody>
                  {/* Dynamically render rows */ }
                  { [
                    {
                      category: 'Features',
                      rows: [
                        {
                          label: 'Brand',
                          values: [ 'EventJacket', 'EventBrite', 'TicketLeap' ],
                        },
                      ],
                    },
                    {
                      category: 'Pricing',
                      rows: [
                        {
                          label: 'Monthly Fee',
                          values: [ 'Free', '39.99', 'Free' ],
                        },
                      ],
                    },
                    // More categories and rows...
                  ].map( ( section, index ) => (
                    <React.Fragment key={ `section-${ index }` }>
                      <tr className="border-b bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                        <th
                          colSpan={ 4 }
                          scope="row"
                          className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                        >
                          { section.category }
                        </th>
                      </tr>
                      { section.rows.map( ( row, rowIndex ) => (
                        <tr key={ `row-${ index }-${ rowIndex }` } className="border-b dark:border-gray-700">
                          <th scope="row" className="px-4 py-3 font-normal whitespace-nowrap">
                            { row.label }
                          </th>
                          { row.values.map( ( value, valueIndex ) => (
                            <td
                              key={ `value-${ index }-${ rowIndex }-${ valueIndex }` }
                              className="px-4 py-3 font-bold text-gray-900 whitespace-nowrap dark:text-white" // Make product names bold
                            >
                              { value }
                            </td>
                          ) ) }
                        </tr>
                      ) ) }
                    </React.Fragment>
                  ) ) }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ComparisonTable;
