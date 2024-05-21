import Sidebar from '@/components/sidebar/sidebar'
import Header from '@/components/header/header'
import Board from '@/components/board/board'

export const dynamic = 'force-dynamic'

export default function Home() {
  // const { data: session } = useSession()
  // const router = useRouter()

  // if (!session) {
  //   router.push('/login')
  //   return null
  // }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ">
      <Sidebar />
      <div className="flex flex-col">
        <Header />
        <Board />
      </div>
    </div>
  )
}
