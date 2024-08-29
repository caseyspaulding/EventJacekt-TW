// components/Sidebar.tsx
export default function Sidebar ()
{
  const navigation = [
    { name: 'Home', href: '#' },
    { name: 'Invoices', href: '#' },
    { name: 'Clients', href: '#' },
    { name: 'Expenses', href: '#' },
  ];

  return (
    <aside className="w-1/4 bg-gray-100 p-4 hidden md:block">
      <h2 className="font-bold text-lg mb-4">Sidebar</h2>
      <ul className="space-y-2">
        { navigation.map( ( item ) => (
          <li key={ item.name } className="bg-gray-200 rounded p-2">
            <a href={ item.href }>{ item.name }</a>
          </li>
        ) ) }
      </ul>
    </aside>
  );
}
