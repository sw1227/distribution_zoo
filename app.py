from flask import Flask, render_template, jsonify, request
import scipy.stats as stats
import numpy as np
app = Flask(__name__)

# ----- View -----
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/distributions/continuous")
def continuous():
    """ 連続型 """
    return render_template("continuous.html")

@app.route("/distributions/discrete")
def discrete():
    """ 離散型 """
    return render_template("discrete.html")

@app.route("/distributions/continuous/normal")
def normal_distribution():
    """ 正規分布 """
    return render_template("normal.html")

@app.route("/distributions/continuous/exponential")
def exponential_distribution():
    """ 指数分布 """
    return render_template("exponential.html")

@app.route("/distributions/continuous/gamma")
def gamma_distribution():
    """ ガンマ分布 """
    return render_template("gamma.html")

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
    x_min = params_dict.pop("x_min", -5)
    x_max = params_dict.pop("x_max",  5)
    func = getattr(stats, func_name)(**params_dict)

    # 値のリストを作成
    x_list = np.linspace(x_min, x_max, 200)
    pdf_list = func.pdf(x_list)
    cdf_list = func.cdf(x_list)
    values = [{"x": x, "pdf": pdf, "cdf": cdf} for (x,pdf,cdf) in zip(x_list, pdf_list, cdf_list)]
    data = {"values": values, "mean": func.mean()}

    return jsonify(data)
