type Props = {
  count: number
}

export const MultipleTasksOverlay = ({ count }: Props) => (
  <div className="relative w-[100px] rounded-[4px] bg-blue-200 p-3 shadow-lg dark:bg-blue-800">
    <div className="absolute -bottom-1/2 left-1/2 flex size-5 -translate-x-1/2 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
      {count}
    </div>
  </div>
)
