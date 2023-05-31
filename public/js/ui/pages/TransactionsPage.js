/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  /**
   * Если переданный элемент не существует,
   * необходимо выкинуть ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * через registerEvents()
   * */
  constructor( element ) {
    if (!element) {
			throw new Error("Элемент не задан");
		}
		this.element = element;
		this.registerEvents();
  }
  /**
   * Вызывает метод render для отрисовки страницы
   * */
  update() {
    this.render(this.lastOptions);
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри обработчика пользуйтесь
   * методами TransactionsPage.removeTransaction и
   * TransactionsPage.removeAccount соответственно
   * */
  registerEvents() {
    
    this.element.addEventListener("click", event => {
			if (event.target.closest(".remove-account")) {
				let id = event.target.closest(".remove-account").dataset.id;
				this.removeAccount(id);
			}
		});

		this.element.addEventListener("click", event => {
			if (event.target.closest(".transaction__remove")) {
				let id = event.target.closest(".transaction__remove").dataset.id;
				this.removeTransaction(id);
			}
		});
  }

  /**
   * Удаляет счёт. Необходимо показать диаголовое окно (с помощью confirm())
   * Если пользователь согласен удалить счёт, вызовите
   * Account.remove, а также TransactionsPage.clear с
   * пустыми данными для того, чтобы очистить страницу.
   * По успешному удалению необходимо вызвать метод App.updateWidgets() и App.updateForms(),
   * либо обновляйте только виджет со счетами и формы создания дохода и расхода
   * для обновления приложения
   * */
  removeAccount() {
    if (this.lastOptions) {
      const id = this.lastOptions.account_id;
      if (confirm('Вы действительно хотите удалить счёт?')) {
        Account.remove({id}, (err, resp) => {
          if (resp) {
            this.clear();
            App.update()
          };
        });
      };
    }
  }

  /**
   * Удаляет транзакцию (доход или расход). Требует
   * подтверждеия действия (с помощью confirm()).
   * По удалению транзакции вызовите метод App.update(),
   * либо обновляйте текущую страницу (метод update) и виджет со счетами
   * */
  removeTransaction(id) {
    if (confirm("Вы действительно хотите удалить эту транзакцию?")) {
    Transaction.remove({id}, (err, resp) => {
      console.log (resp)
				if (resp) {
					App.update();
				}
			});
		}
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через TransactionsPage.renderTitle.
   * Получает список Transaction.list и полученные данные передаёт
   * в TransactionsPage.renderTransactions()
   * */
   render(options){
    this.lastOptions = options;
    if (!options) {
      return
    }
    
    Account.get(options.account_id, (err, response) => {
      if (response) {
        this.renderTitle(response.data.name);
      }
    })
    
    Transaction.list(options, (err, response) => {
      if(response) {
        this.renderTransactions(response.data);
      }
    });
  }


  /**
   * Очищает страницу. Вызывает
   * TransactionsPage.renderTransactions() с пустым массивом.
   * Устанавливает заголовок: «Название счёта»
   * */
  clear() {
    this.renderTransactions([]);
		this.renderTitle("Название счета");
		this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name){
    this.element.querySelector(".content-title").textContent = name;
  }

  /**
   * Форматирует дату в формате 2019-03-10 03:20:41 (строка)
   * в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(date){
    let newDate = new Date(date);
		let months = [
      "января",
      "февраля",
      "марта",
      "апреля",
      "мая",
      "июня",
      "июля",
      "августа",
      "сентября",
      "октября",
      "ноября",
      "декабря"
    ];
		let month = months[newDate.getMonth()];
		let day = newDate.getDate();
		let year = newDate.getFullYear();
		let hours = newDate.getHours();
		let minutes = newDate.getMinutes();

		function formatTime(integer) {
			if (integer < 10) {
				return "0" + integer;
			} else {
				return integer;
			}
		};
		return `${day} ${month} ${year} г. в ${formatTime(hours)}:${formatTime(minutes)}`;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * item - объект с информацией о транзакции
   * */
  getTransactionHTML(item){
    const id = item.id;
		const type = item.type;
		const name = item.name;
		const date = this.formatDate(item.created_at);
		const sum = item.sum;
		return `
      <div class="transaction transaction_${type} row">
          <div class="col-md-7 transaction__details">
              <div class="transaction__icon">
                  <span class="fa fa-money fa-2x"></span>
              </div>
              <div class="transaction__info">
                  <h4 class="transaction__title">${name}</h4>
                  <div class="transaction__date">${date}</div>
              </div>
          </div>
          <div class="col-md-3">
              <div class="transaction__summ">
                  ${sum} <span class="currency">₽</span>
              </div>
          </div>
          <div class="col-md-2 transaction__controls">
              <button class="btn btn-danger transaction__remove" data-id="${id}">
                <i class="fa fa-trash"></i>
              </button>
          </div>
      </div>`;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data){
    const element = this.element.querySelector(".content");
		if (data) {
			element.innerHTML = "";
			for (let i = 0; i < data.length; i++) {
				element.innerHTML += this.getTransactionHTML(data[i]);
			}
		}
  }
}

