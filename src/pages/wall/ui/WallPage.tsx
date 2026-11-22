import { useNavigate } from 'react-router'
import { Fab, PageHeader } from '../../../shared/ui'
import { CardGrid } from '../../../widgets/card-grid'

export function WallPage() {
  const navigate = useNavigate()

  return (
    <>
      <PageHeader title="Стена" />
      <CardGrid categoryId={null} emptyText="Стена пуста. Нажми +, чтобы добавить первую карточку." />
      <Fab label="Новая карточка" onClick={() => navigate('/cards/new')} />
    </>
  )
}
