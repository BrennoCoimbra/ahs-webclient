define(["./utility", "../model/models"], function (utility, models) {
  class Controller {
    /**
     * Event handler when initializing the current view.
     * @param {SDKEnv} oEnv the current sdk environment
     * @param {Event} oEvent the view init event
     */
    async onInit(oEnv, oEvent) {
      console.log("onInit invoked");
    }

    /**
     * Event handler when loading data to the current view. It is asynchronously triggered after onInit.
     * @param {SDKEnv} oEnv the current sdk environment
     * @param {Event} oEvent the view dataLoad event
     */
    async onDataLoad(oEnv, oEvent) {
      console.log("onDataLoad invoked");
    }

    /**
     * Event handler when exiting from the current view.
     * @param {SDKEnv} oEnv the current sdk environment
     * @param {Event} oEvent the view exit event
     */
    async onExit(oEnv, oEvent) {
      console.log("onExit invoked");
    }

    /**
     * Event handler on clicking the customized button.
     * @param {SDKEnv} oEnv the current sdk environment
     * @param {Event} oEvent the button click event
     */
    async onButtonClick(oEnv, oEvent) {
      await oEnv.showToastMessage('Indo para o Aster...');
      await oEnv.open("https://aster.gruposps.com.br");
      /*
      const oView = await oEnv.ActiveView();
      await oView.showBusy();

      const service = await oEnv.getService();
      const response = await service.ServiceLayer.get("CompanyService_GetCompanyInfo");
      if(response.isSuccess()){
        const companyInfo = response.getData();
        const messageArr = [
          `Company Name: ${companyInfo.CompanyName}`,
          `Version: ${companyInfo.Version}`,
        ];
        await oEnv.showMessageBox(
          "Information",
          utility.StringJoin(messageArr, "\n"),
          {
            title: models.title,
          }
        );
      }
      await oView.hideBusy();
      */
    }
  }
  return Controller;
});