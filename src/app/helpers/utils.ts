export class Utils {
    /**
     * Lädt externe JavaScript files runter und fügt diese dem document hinzu.
     *
     * @param {string} url
     * @returns {Promise<any>}
     */
    static loadScript(url: string) {
        return new Promise((resolve, reject) => {
            const scriptElement = document.createElement('script');
            scriptElement.src = url;
            scriptElement.onload = resolve;
            document.body.appendChild(scriptElement);
        });
    }

    /**
     * Angular workaround for
     * <a href="https://github.com/scttcper/ngx-toastr/issues/160">ngx-toastr issue 160</a>
     *
     * @param callback
     * @param {number} timeout
     */
    static sendMessage(callback, timeout: number = 0) {
        setTimeout(callback, timeout);
    }

    /**
     * Formatiert ein Datum vom Typ Date-Object zu einem für Carbon lesbaren String
     *
     * @param {Date} date
     * @returns {string}
     */
    static carbonFormatString(date: Date) {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    /**
     * Gibt den Int-Wert des übergebenen Boolean zurück.
     *
     * @param {boolean} value
     * @returns {number | number}
     */
    static booleanToInt(value: boolean) {
        return value ? 1 : 0;
    }
}
