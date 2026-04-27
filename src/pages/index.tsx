import Button from "components/Button";
import DataPreview from "containers/DataPreview/DataPreview";
import { NextPage } from "next";
import OShape from "images/o_shape.svg";
import { useModal } from "context/ModalContext";
import { FormDataDTO } from "models/FormDataDTO";

const DEFAULT_FORM_DATA: Partial<FormDataDTO> = {
  email: "",
  clinic: [""],
  acceptedTerms: false,
};

const HomePage: NextPage = () => {
  const { open, submittedData } = useModal<Partial<FormDataDTO>>(
    "newsletter",
    DEFAULT_FORM_DATA,
  );

  return (
    <div className="min-h-[100vh]">
      <div className="relative z-0 flex flex-col items-center py-16 gap-6 p-6 max-w-[1440px] mx-auto">
        <OShape className="absolute -top-40 right-10 -z-10 max-h-[100vh]" />
        <div>
          <img
            className="mx-autoblock w-[310px] h-[64px] mb-[90px] mx-auto"
            src={"/logo/demant/logo.svg"}
            alt={"Demant logo"}
          />
        </div>

        <DataPreview data={submittedData ?? DEFAULT_FORM_DATA} />

        <div className={"w-[80vw] md:w-[600px]"}>
          <Button className={"w-full"} onClick={open} label={"Show modal"} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
