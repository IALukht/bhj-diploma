/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accountsSelectList = this.element.querySelector(".accounts-select");

		Account.list(User.current(), (err, response) => {
			if (response && response.success) {
				accountsSelectList.innerHTML = "";
				response.data.forEach((item) => {
					accountsSelectList.innerHTML += `<option value="${item.id}">${item.name}</option>`;
				})
			} else {
				console.log("Ошибка при получении списка счетов");
			}
		});
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit(data) {
    Transaction.create(data, (err, response) => {
			if (response && response.success) {
				this.element.reset();
				const type = data.type;
				const modalName = 'new' + type[0].toUpperCase() + type.substr(1);
				let transactionModal = App.getModal(modalName);
				transactionModal.close();
				App.update();
			}
		});
  }
}
