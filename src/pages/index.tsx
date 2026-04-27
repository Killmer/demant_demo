import Button from "components/Button";
import DataPreview from "containers/DataPreview/DataPreview";
import NewsletterSignupModal from "containers/NewsletterSignupModal/NewsletterSignupModal";

import { FormDataDTO } from "models/FormDataDTO";
import { NextPage } from "next";
import { useState } from "react";
import OShape from "images/o_shape.svg";

const HomePage: NextPage = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [submittedData, setSubmittedData] = useState<Partial<FormDataDTO>>({
    email: "",
    clinic: [""],
    acceptedTerms: false,
  });

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

        <DataPreview data={submittedData} />

        <div className={"w-[80vw] md:w-[600px]"}>
          <Button
            className={"w-full"}
            onClick={() => setIsModalVisible(true)}
            label={"Show modal"}
          />
        </div>
        <NewsletterSignupModal
          isOpen={isModalVisible}
          onClose={() => setIsModalVisible(false)}
          onSubmit={(data) => {
            setSubmittedData(data);
            setIsModalVisible(false);
          }}
        />
      </div>
    </div>
  );
};

export default HomePage;
