type PostPictureProps = {
    src: string;
    alt?: string;
};

function PostPicture({ src, alt = "Attachment" }: PostPictureProps) {
    const trimmed = src.trim();
    if (!trimmed) {
        return null;
    }

    return (
        <figure className="post-picture">
            <img src={trimmed} alt={alt} loading="lazy" />
        </figure>
    );
}

export default PostPicture;
