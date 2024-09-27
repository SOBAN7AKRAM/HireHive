import edit from '../../assets/edit.png'

const Edit = ({onClick}) => {
    return (
        <div className='edit' onClick={onClick}>
            <img className='icon' src={edit} />
        </div>
    )
}

export default Edit;