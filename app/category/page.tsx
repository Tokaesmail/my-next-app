import Categorycart from '../categoryCart/categorycart';

export default async function GetCategory() {

    const response= await fetch('https://ecommerce.routemisr.com/api/v1/categories',
      {
      method: "GET",
      next: { revalidate: 60 },
    },
    )
    if(!response.ok){
      throw new Error('failed to fetch category')
    }
    
    let {data:category }= await response.json()
    console.log(category);
    
  return (
    <>
    
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 ">
        {category.map((pro:any)=>(
          <Categorycart key={pro._id} pro={pro}/>
        ))}
      </div>
    </>
  )
}
