import BackButton from '../back-button';

export default function EmptyList({ title, message
}: {
    title: string;
    message: string;
}) {
    return (
        <div className='mt-20 mb-20 text-center flex flex-col gap-6 '>
            <h2 className='text-4xl font-bold text-primary'>{title}</h2>
            <p className="text-xl">{message}</p>
            <BackButton />
        </div>
    )
}