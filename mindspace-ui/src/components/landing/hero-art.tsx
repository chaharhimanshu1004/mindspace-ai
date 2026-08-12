import Image from "next/image";

export function HeroArt() {
    return (
        <div className="relative mx-auto w-full max-w-[560px]">
            <Image
                src="/hero-team.webp"
                alt="Four colleagues around a table reviewing a shared board of notes and charts"
                width={1080}
                height={1060}
                priority
                sizes="(min-width: 1024px) 560px, 100vw"
                className="h-auto w-full select-none"
            />
        </div>
    );
}
