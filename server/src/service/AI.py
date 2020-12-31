import tensorflow as tf
from tensorflow.keras.models import load_model
import numpy as np

from utils.patterns import Enum

global graph
graph = tf.get_default_graph()


session = tf.keras.backend.get_session()
init = tf.global_variables_initializer()
session.run(init)
lum_class_nn = load_model("../data/lum_class/lum_class.h5")


class NNInstance(Enum):
    LUM_CLASS = lum_class_nn


class NN:

    instance = NNInstance

    @staticmethod
    def predict_class(instance, input):
        return NN.predict(instance, input).argmax()


    @staticmethod
    def predict(instance, input):
        with graph.as_default():
            tf.keras.backend.set_session(session)
            return instance.value.predict(np.array([input]))[0]