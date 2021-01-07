import './Card.scss'

const Card = ({title, number}) => {
  return(
    <div className="card">
      
      <div className="card-body font-weight-bold">
        <div className="card-title">
          <h5>{title}</h5>
        </div>
        <h3 className="numbers mb-0">
          {number}
        </h3>
      </div>
    </div>
  )
}

export default Card