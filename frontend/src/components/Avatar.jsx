import { useState } from 'react';

const Avatar = () => {
    const [images, setImages] = useState([
        { id: 1, src: './src/assets/avatar.svg' },
        { id: 2, src: './src/assets/avatar.svg' },
        { id: 3, src: './src/assets/avatar.svg' },
        { id: 4, src: './src/assets/avatar.svg' }
    ]);
    return (
        <div>
            <div className='avatar-group -space-x-4'>
                {images.length ? (
                    images.map((e) => (
                        <div className='avatar' key={e.id}>
                            <div className='w-[36px]'>
                                <img src={e.src} />
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No Team</p>
                )}
            </div>
        </div>
    );
};

export default Avatar;
