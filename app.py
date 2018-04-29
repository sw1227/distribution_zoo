from flask import Flask, render_template, jsonify, request
import scipy.stats as stats
import numpy as np
app = Flask(__name__)

# ----- View -----
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/distributions/continuous/normal")
def normal_distribution():
    """ 正規分布 """
    return render_template("normal.html")


# ----- API -----
@app.route("/api/calculate/<func_name>")
def calculate(func_name=None):
    """
    scipy.statsを使って与えられた分布に従うリストを作成する
    - func_name: scipy.stats.<func_name>を呼び出す
    - scipy.stats.<func_name>の分散・平均etcはクエリパラメータで指定
    """
    # TODO: func_nameがNoneの時の処理

    # 例えば "/api/calculate/norm/?loc=0.0&scale=1.0" に対して、
    # stats.norm(loc=loc, scale=scale) を呼び出したい
    params_dict = request.args.to_dict() # クエリパラメータを辞書に変換
    params_dict = dict([(k, float(params_dict[k])) for k in params_dict]) # パラメータ値をfloatに
    func = getattr(stats, func_name)(**params_dict)

    # 値のリストを作成
    # TODO: range
    x_list = np.linspace(-5, 5, 100)
    y_list = func.pdf(x_list)
    data = [{"x": x, "y": y} for (x, y) in zip(x_list, y_list)]

    return jsonify(data)
