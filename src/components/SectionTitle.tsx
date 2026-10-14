type SectionTitleProps = {
  title: string
  description?: string
}

function SectionTitle({ title, description }: SectionTitleProps) {
  return (
    <div className="mb-8">
      <h1 className="text-4xl font-bold">{title}</h1>
      {description && <p className="mt-3 max-w-2xl text-base opacity-75">{description}</p>}
    </div>
  )
}

export default SectionTitle