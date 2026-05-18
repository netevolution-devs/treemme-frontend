import {carrierApi} from "@features/panels/contacts/carriers/api/carrierApi";

const CarriersList = () => {
    const {data: carriers} = carrierApi.useGetList();

    return (
        <>
            <pre>{JSON.stringify(carriers, null, 2)}</pre>
        </>
    )
}

export default CarriersList;