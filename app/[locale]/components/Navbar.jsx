import Link from "next/link"

export default function Navbar() {
    return (
        <div className="flex gap-2">
            <Link href={'/'}>Home</Link>
            <Link href={'/about'}>About</Link>
            <Link href={`/`} locale="en">English</Link>
            <Link href={'/'} locale="jp">Japanese</Link>

        </div>
    )
}