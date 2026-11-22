import { useNavigate, useParams } from 'react-router'
import { useCategory } from '../../../entities/category'
import { Fab, PageHeader } from '../../../shared/ui'
import { CardGrid } from '../../../widgets/card-grid'

export function CategoryPage() {
  const { categoryId = '' } = useParams()
  const navigate = useNavigate()
  const { data: category, isPending } = useCategory(categoryId)

  if (isPending) return <PageHeader title="" backTo="/categories" />
  if (!category) {
    return (
      <>
        <PageHeader title="Категория не найдена" backTo="/categories" />
      </>
    )
  }

  return (
    <>
      <PageHeader title={category.name} backTo="/categories" />
      <CardGrid categoryId={category.id} emptyText="В этой категории пока нет карточек." />
      <Fab
        label="Новая карточка в категории"
        onClick={() => navigate(`/cards/new?category=${category.id}`)}
      />
    </>
  )
}
