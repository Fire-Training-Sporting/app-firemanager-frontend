import TableBase from '../TableBase';
import { BtnBlue } from '../Buttons/BtnBlue';
import { BtnRed } from '../Buttons/BtnRed';

export default function ServicoLista({ servicos = [] }) {

  const colunas = [
    {
      key: 'nome',
      label: 'Serviço',
      className: 'text-left',
      style: { width: '100%' },
    },
    {
      key: 'acoes',
      label: 'Ações',
      className: 'text-left whitespace-nowrap',
      style: { width: '35%' },
      tdClassName: 'text-left whitespace-nowrap',
      render: () => (
        <div className="flex justify-between items-center gap-2 whitespace-nowrap">
          <BtnBlue content="Editar" />
          <BtnRed content="Excluir" />
        </div>
      ),
    },
  ];

  return (
    <TableBase columns={colunas} data={servicos} wrapperClassName="w-full" tableClassName="w-full table-fixed" />
  );
}