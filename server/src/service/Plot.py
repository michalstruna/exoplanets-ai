from collections import OrderedDict
import matplotlib
import matplotlib.pyplot as plt
import io
import numpy as np

matplotlib.use("Agg")


class PlotService:
 
    FULL_HD = (8, 4.5)
    SQUARE = (5, 5)

    def to_float(self, value):
        try:
            return float(value)
        except:
            return value

    def _plot(self, figsize, return_range, func, args={}, xscale="linear", yscale="linear", format="svg"):
        buf = io.BytesIO()

        plt.figure(figsize=figsize)
        plt.xscale(xscale)
        plt.yscale(yscale)
        func(**args)
        plt.margins(0, 0)
        plt.gca().set_axis_off()
        plt.subplots_adjust(top=1, bottom=0, right=1, left=0, hspace=0, wspace=0)
        plt.savefig(buf, transparent=True, format=format)
        plt.show() 

        buf.seek(0)


        if return_range:
            xmin, xmax, ymin, ymax = plt.axis()
            return buf.getvalue(), self.to_float(xmin), self.to_float(xmax), self.to_float(ymin), self.to_float(ymax)
        else:
            return buf.getvalue()

    def main_scatter(self, semaxes, masses, alpha=0.5, size=10, figsize=FULL_HD, return_range=False):
        return self._plot(
            figsize, return_range, plt.scatter,
            dict(x=semaxes, y=massess, c="#EEE", s=size, alpha=alpha),
            format="png"
        )  # TODO: Conditional log scale.

    def pie(self, values, width=1, colors=["#A55", "#5A5"], figsize=SQUARE):
        return self._plot(
            figsize, False, plt.scatter,
            dict(x=values, wedgeprops=dict(width=width), startangle=90, colors=colors)
        )

    def hist(self, values, bins, figsize=FULL_HD, color="#47A", return_range=False):
        is_str = type(bins[0]) == str

        if is_str:
            categories, tmp = np.unique(values, return_counts=True)
            categories = list(categories)
            vals = []

            for bin in bins:
                vals.append(tmp[categories.index(bin)] if bin in categories else 0) 
        else:
            vals, bins = np.histogram(values, bins=bins)
            
        bins = range(len(vals))

        buf = io.BytesIO()

        plt.figure(figsize=figsize)
        plt.bar(bins, vals, color=color)
        max_val = max(vals)

        for i, value in enumerate(vals):
            is_in_bar = value / max_val > 0.9
            y = value - (max_val / 10) if is_in_bar else value + (max_val / 30)

            plt.text(i, y, str(value), color="#EEE", fontsize=25, horizontalalignment="center") 

        plt.margins(0, 0)
        plt.gca().set_axis_off()
        plt.subplots_adjust(top=1, bottom=0, right=1, left=0, hspace=0, wspace=0)
        plt.savefig(buf, transparent=True, format="svg")
        plt.show() 

        buf.seek(0)  

        if return_range:
            xmin, xmax, ymin, ymax = plt.axis()
            return buf.getvalue(), float(ymax)
        else:
            return buf.getvalue()
