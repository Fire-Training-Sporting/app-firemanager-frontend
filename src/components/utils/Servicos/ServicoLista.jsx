import TableBase from '../TableBase';

export default function ServicoLista({
  servicos = [],
  onToggleStatus,
  canToggleStatus = true,
}) {
  const colunas = [
    {
      key: 'nome',
      label: 'Serviço',
      className: 'text-left',
      style: { width: '80%' },
    },

    {
      key: 'ativo',
      label: 'Ativo',
      className: 'text-center',
      tdClassName: 'text-center',
      style: { width: '20%' },

      render: (servico) => (
        <div className="flex justify-center">
          <button
            type="button"
            disabled={!canToggleStatus}
            onClick={() => onToggleStatus(servico)}
            className={`
              relative w-14 h-8 rounded-full transition-all duration-300
              ${
                servico.ativo
                  ? 'bg-green-500'
                  : 'bg-gray-300'
              }
              ${
                !canToggleStatus
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer'
              }
            `}
          >
            <span
              className={`
                absolute top-1 left-1
                w-6 h-6 rounded-full bg-white shadow-md
                transition-all duration-300
                ${
                  servico.ativo
                    ? 'translate-x-6'
                    : 'translate-x-0'
                }
              `}
            />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      <TableBase
        columns={colunas}
        data={servicos}
        wrapperClassName="w-full"
        tableClassName="w-full table-fixed"
      />
    </div>
  );
}