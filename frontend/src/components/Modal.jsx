import Button from './Button';

const Modal = ({ className, onSubmit, ...props }) => {
    return (
        <div className='modal' id='my-modal-2'>
            <div className='modal-box'>
                <h3 className='font-bold text-lg'>Are you sure?</h3>
                <p className='py-4'>All the information will be upload publicly</p>
                <div className='modal-action'>
                    <a href='#' className='btn btn-error'>
                        Cancel
                    </a>
                    <Button onSubmit={onSubmit} className='btn btn-primary' {...props}>
                        Submit Question
                    </Button>
                </div>
            </div>
        </div>
    );
};

const ModalButton = ({ text = 'contoh', className, ...props }) => {
    return (
        <a href='#my-modal-2' className={`${className}`} {...props}>
            {text}
        </a>
    );
};

Modal.ModalButton = ModalButton;

export default Modal;
