import { FormDataDTO } from 'models/FormDataDTO';
import { FunctionComponent } from 'react';

interface Props {
  data: Partial<FormDataDTO>;
}

const DataPreview: FunctionComponent<Props> = ({ data }) => {

  return (
    <div id="form-data-preview" className={'bg-white rounded-6 p-12 w-[600px]'}>

      <div className="text-head-3 font-medium mb-8">
        Form data preview
      </div>
      <div className={'grid grid-cols-2 gap-6 w-full'}>
        <span className={'font-medium'}>
          Email:
        </span>
        <span>
          {data.email}
        </span>
        <span className={'font-medium'}>
          Clinic:
        </span>
        <ul>
          {data.clinic?.map(x => <li className="mb-4 leading-none">{x}</li>)}
        </ul>
        <span className={'font-medium'}>
          Accepted terms
        </span>
        <span>
          {data.acceptedTerms ? 'Yes' : 'No'}
        </span>
      </div>
    </div>
  );
};

export default DataPreview;
