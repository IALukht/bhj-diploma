/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor( element ) {
    super( element );
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    const accoutSelect = this.element.querySelector('.accounts-select'),
        renderItem = item => {console.log(item); accoutSelect.innerHTML += `<option value="${item.id}">${item.name}</option>`;}

    Account.list(User.current(), (err, response) => {
      if (response && response.data) {
        accoutSelect.innerHTML = '';
        response.data.forEach( renderItem );
      } else {
        return;
      }
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно,
   * в котором находится форма
   * */
  onSubmit( options ) {
    Transaction.create( options.data, ( err, response ) => {
      if ( !response.success ) {
        return
      }
      App.getWidget( 'accounts' ).update();
      this.element.reset();

      const { type } = options.data,
          modalName = 'new' + type[ 0 ].toUpperCase() + type.substr( 1 ),
          modal = App.getModal( modalName );
      modal.close();

      App.update();
    });
  }
}
